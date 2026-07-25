from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

from seed_data import SEED_PRODUCTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    brand: str
    category: str
    price: float
    old_price: Optional[float] = None
    currency: str = "EUR"
    tagline: str = ""
    description: str = ""
    image: str
    gallery: List[str] = []
    specs: Dict[str, str] = {}
    colors: List[str] = []
    stock: int = 50
    rating: float = 4.8
    reviews: int = 0
    featured: bool = False
    badge: Optional[str] = None


class OrderItem(BaseModel):
    product_id: str
    slug: str
    name: str
    price: float
    quantity: int
    image: str


class OrderCreate(BaseModel):
    items: List[OrderItem]
    full_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str
    country: str = "România"
    notes: Optional[str] = ""
    shipping_method: str = "standard"


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    full_name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str
    country: str
    notes: Optional[str] = ""
    shipping_method: str
    status: str = "confirmed"
    created_at: str = Field(default_factory=now_iso)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "VOLT electronics API"}


@api_router.get("/categories")
async def get_categories():
    cats = await db.products.distinct("category")
    result = []
    for c in cats:
        count = await db.products.count_documents({"category": c})
        result.append({"name": c, "count": count})
    result.sort(key=lambda x: x["name"])
    return result


@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    sort: Optional[str] = None,
    limit: int = 100,
):
    query: Dict[str, Any] = {}
    if category and category.lower() != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"tagline": {"$regex": search, "$options": "i"}},
        ]

    sort_map = {
        "price_asc": [("price", 1)],
        "price_desc": [("price", -1)],
        "rating": [("rating", -1)],
        "name": [("name", 1)],
    }
    cursor = db.products.find(query, {"_id": 0})
    if sort in sort_map:
        cursor = cursor.sort(sort_map[sort])
    products = await cursor.to_list(limit)
    return [Product(**p) for p in products]


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Produsul nu a fost gasit")
    return Product(**doc)


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cosul este gol")
    subtotal = sum(i.price * i.quantity for i in payload.items)
    if payload.shipping_method == "pickup":
        shipping = 0.0
    elif payload.shipping_method == "express":
        shipping = 25.0
    else:  # standard
        shipping = 0.0 if subtotal >= 200 else 15.0
    total = round(subtotal + shipping, 2)
    order_number = "VLT-" + datetime.now(timezone.utc).strftime("%y%m%d") + "-" + uuid.uuid4().hex[:5].upper()
    order = Order(
        order_number=order_number,
        items=payload.items,
        subtotal=round(subtotal, 2),
        shipping=shipping,
        total=total,
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        address=payload.address,
        city=payload.city,
        postal_code=payload.postal_code,
        country=payload.country,
        notes=payload.notes,
        shipping_method=payload.shipping_method,
    )
    await db.orders.insert_one(order.model_dump())
    return order


@api_router.get("/orders/{order_number}", response_model=Order)
async def get_order(order_number: str):
    doc = await db.orders.find_one({"order_number": order_number}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Comanda nu a fost gasita")
    return Order(**doc)


async def seed_database():
    count = await db.products.count_documents({})
    if count == 0:
        await db.products.insert_many([dict(p) for p in SEED_PRODUCTS])
        logging.info("Seeded %d products", len(SEED_PRODUCTS))


@app.on_event("startup")
async def on_startup():
    await seed_database()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

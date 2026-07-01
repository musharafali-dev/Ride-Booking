from sqlalchemy.orm import Session
from app.db.session import SessionLocal, Base, engine
from app.models.user import User
from app.models.vehicle import Vehicle
from app.models.tour import Tour
from app.core.security import get_password_hash

def seed_db():
    # Make sure we start with a clean slate
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    print("Seeding database...")
    
    # Create default users
    admin_pw = get_password_hash("admin123")
    admin = User(
        email="admin@ridesphere.com",
        hashed_password=admin_pw,
        full_name="RideSphere Admin",
        role="admin",
        is_verified=True,
        wallet_balance=1000.0
    )
    
    owner_pw = get_password_hash("owner123")
    owner = User(
        email="owner@ridesphere.com",
        hashed_password=owner_pw,
        full_name="Fleet Owner John",
        role="owner",
        is_verified=True,
        wallet_balance=0.0
    )
    
    customer_pw = get_password_hash("customer123")
    customer = User(
        email="customer@ridesphere.com",
        hashed_password=customer_pw,
        full_name="Jane Doe",
        role="customer",
        is_verified=True,
        wallet_balance=500.0
    )
    
    db.add(admin)
    db.add(owner)
    db.add(customer)
    db.commit()
    db.refresh(owner)
    
    # Create default vehicles (12 items matching the specifications)
    vehicles = [
        Vehicle(
            owner_id=owner.id,
            category="economy_car",
            make="Toyota",
            model="Corolla",
            year=2022,
            color="Silver",
            license_plate="LEC-5566",
            price_per_day=50.0,
            price_per_hour=8.0,
            seats=5,
            transmission="automatic",
            fuel_type="hybrid",
            image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="sedan",
            make="Honda",
            model="Civic",
            year=2023,
            color="White",
            license_plate="LEB-1122",
            price_per_day=60.0,
            price_per_hour=10.0,
            seats=5,
            transmission="automatic",
            fuel_type="petrol",
            image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="suv",
            make="Toyota",
            model="Prado",
            year=2021,
            color="Black",
            license_plate="SUV-4455",
            price_per_day=180.0,
            price_per_hour=25.0,
            seats=7,
            transmission="automatic",
            fuel_type="diesel",
            image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="luxury_car",
            make="BMW",
            model="X5",
            year=2022,
            color="Blue",
            license_plate="VIP-999",
            price_per_day=220.0,
            price_per_hour=30.0,
            seats=5,
            transmission="automatic",
            fuel_type="petrol",
            image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="sports_car",
            make="Porsche",
            model="911",
            year=2023,
            color="Red",
            license_plate="SPD-911",
            price_per_day=450.0,
            price_per_hour=60.0,
            seats=2,
            transmission="automatic",
            fuel_type="octane",
            image_url="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="city_bike",
            make="Honda",
            model="CB150F",
            year=2022,
            color="Black",
            license_plate="MTR-7711",
            price_per_day=20.0,
            price_per_hour=3.0,
            seats=2,
            transmission="manual",
            fuel_type="petrol",
            image_url="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="touring_bike",
            make="Yamaha",
            model="MT-15",
            year=2022,
            color="Cyan",
            license_plate="MTR-8844",
            price_per_day=30.0,
            price_per_hour=4.5,
            seats=2,
            transmission="manual",
            fuel_type="petrol",
            image_url="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="sports_bike",
            make="Kawasaki",
            model="Ninja 650",
            year=2021,
            color="Green",
            license_plate="SPD-650",
            price_per_day=75.0,
            price_per_hour=12.0,
            seats=2,
            transmission="manual",
            fuel_type="octane",
            image_url="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="touring_bike",
            make="Honda",
            model="Gold Wing",
            year=2020,
            color="Gold",
            license_plate="GW-1800",
            price_per_day=120.0,
            price_per_hour=18.0,
            seats=2,
            transmission="automatic",
            fuel_type="petrol",
            image_url="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="coaster",
            make="Toyota",
            model="Coaster",
            year=2021,
            color="White",
            license_plate="BUS-5566",
            price_per_day=150.0,
            price_per_hour=25.0,
            seats=29,
            transmission="manual",
            fuel_type="diesel",
            image_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="tourist_bus",
            make="Hyundai",
            model="Universe Bus",
            year=2019,
            color="Red",
            license_plate="BUS-9900",
            price_per_day=280.0,
            price_per_hour=40.0,
            seats=45,
            transmission="manual",
            fuel_type="diesel",
            image_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
            is_available=True
        ),
        Vehicle(
            owner_id=owner.id,
            category="electric_vehicle",
            make="Tesla",
            model="Model 3",
            year=2022,
            color="Gray",
            license_plate="EV-333",
            price_per_day=140.0,
            price_per_hour=20.0,
            seats=5,
            transmission="automatic",
            fuel_type="electric",
            image_url="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
            is_available=True
        )
    ]
    
    for v in vehicles:
        db.add(v)
        
    # Create default tours
    tours = [
        Tour(
            title="Hunza Valley Adventure",
            description="Explore the scenic landscapes of Hunza Valley, Attabad Lake, and Karimabad bazaar. Includes hotel stay and standard meals.",
            price=399.0,
            duration_days=7,
            itinerary="Day 1: Islamabad to Chilas, Day 2: Hunza Arrival, Day 3: Karimabad sights, Day 4: Khunjerab Pass excursion, Day 5: Attabad lake boat ride, Day 6: Travel back to Besham, Day 7: Return to Islamabad.",
            is_active=True
        ),
        Tour(
            title="Lahore Cultural Day Tour",
            description="Experience the history of Lahore: Badshahi Mosque, Lahore Fort, Shalimar Gardens, and traditional food street.",
            price=45.0,
            duration_days=1,
            itinerary="Morning: Badshahi Mosque & Lahore Fort, Afternoon: Shalimar Gardens, Evening: Food Street dinner.",
            is_active=True
        )
    ]
    
    for t in tours:
        db.add(t)
        
    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()

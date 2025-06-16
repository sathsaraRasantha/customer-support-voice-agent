import sqlite3
from typing import Optional, List
from dataclasses import dataclass
from contextlib import contextmanager

# Data Models
@dataclass
class MenuItem:
    item_id: int
    name: str
    cuisine: str
    price: float

@dataclass
class TakeawayOrder:
    id: int
    customer_name: str
    mobile_number: str
    items: str  # comma-separated list of items
    total_price: float
    order_status: str
    pickup_time: str

@dataclass
class Reservation:
    id: int
    customer_name: str
    mobile_number: str
    date: str
    time: str
    table_number: int
    num_people: int

class RestaurantDatabaseDriver:
    def __init__(self, db_path: str = "restaurant_db.sqlite"):
        self.db_path = db_path
        self._init_db()

    @contextmanager
    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
        finally:
            conn.close()

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()

            # Menu table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS menu (
                    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    cuisine TEXT,
                    price REAL NOT NULL
                )
            """)

            # Takeaway Orders table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS takeaway_orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_name TEXT NOT NULL,
                    mobile_number TEXT NOT NULL,
                    items TEXT NOT NULL,
                    total_price REAL NOT NULL,
                    order_status TEXT NOT NULL,
                    pickup_time TEXT NOT NULL
                )
            """)

            # Reservations table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS reservations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_name TEXT NOT NULL,
                    mobile_number TEXT NOT NULL,
                    date TEXT NOT NULL,
                    time TEXT NOT NULL,
                    table_number INTEGER NOT NULL,
                    num_people INTEGER NOT NULL
                )
            """)
            conn.commit()

    # Create a takeaway order
    def create_order(self, customer_name: str, mobile_number: str, items: str,
                     total_price: float, order_status: str, pickup_time: str) -> TakeawayOrder:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO takeaway_orders 
                (customer_name, mobile_number, items, total_price, order_status, pickup_time)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (customer_name, mobile_number, items, total_price, order_status, pickup_time))
            conn.commit()
            order_id = cursor.lastrowid
            return TakeawayOrder(order_id, customer_name, mobile_number, items, total_price, order_status, pickup_time)

    # Get order by mobile number
    def get_order_by_mobile_number(self, mobile_number: str) -> List[TakeawayOrder]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM takeaway_orders WHERE mobile_number = ?", (mobile_number,))
            rows = cursor.fetchall()
            return [
                TakeawayOrder(id=row[0], customer_name=row[1], mobile_number=row[2],
                              items=row[3], total_price=row[4],
                              order_status=row[5], pickup_time=row[6])
                for row in rows
            ]

    # Create a reservation
    def create_reservation(self, customer_name: str, mobile_number: str, date: str, time: str,
                           table_number: int, num_people: int) -> Reservation:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO reservations 
                (customer_name, mobile_number, date, time, table_number, num_people)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (customer_name, mobile_number, date, time, table_number, num_people))
            conn.commit()
            res_id = cursor.lastrowid
            return Reservation(res_id, customer_name, mobile_number, date, time, table_number, num_people)

    # Get reservation by mobile number
    def get_reservation_by_mobile_number(self, mobile_number: str) -> List[Reservation]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM reservations WHERE mobile_number = ?", (mobile_number,))
            rows = cursor.fetchall()
            return [
                Reservation(id=row[0], customer_name=row[1], mobile_number=row[2],
                            date=row[3], time=row[4], table_number=row[5], num_people=row[6])
                for row in rows
            ]

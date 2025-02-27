import csv
import random
import uuid
from datetime import datetime, timedelta

# Define possible coal types
coal_types = ["anthracite", "bituminous", "lignite"]

# Generate sample data
num_entries = 52  # 52 weeks of data
start_date = datetime(2024, 1, 1)  # Start from 1st Jan 2024
data = []

for i in range(num_entries):
    date = start_date + timedelta(days=i * 7)  # 7-day gap for each entry
    plf = round(random.uniform(50, 90), 2)  # PLF in percentage (50-90%)
    production = random.randint(500, 5000)  # Electricity production in MWh
    total_emission = round(random.uniform(750, 850) * production, 2)  # Emission in g/kWh converted to total
    timestamp = date.isoformat()
    
    # Generate coal usage details
    coal_uses = []
    num_coal_types = random.randint(1, 3)  # A plant may use 1-3 types of coal
    
    for _ in range(num_coal_types):
        burnt_amount = round(random.uniform(50, 500), 2)  # Burnt coal in tonnes
        coal_use = {
            "_id": str(uuid.uuid4()),  # Unique identifier
            "coaltype": random.choice(coal_types),
            "gcv": round(random.uniform(3000, 6000), 2),  # GCV in kcal/kg
            "burntamount": burnt_amount,  # Burnt coal in tonnes
            "carbonemission": round(random.uniform(200, 350) * burnt_amount, 2)  # Carbon emissions in kg
        }
        coal_uses.append(coal_use)
    
    # Add to dataset
    for coal_use in coal_uses:
        data.append({
            "_id": str(uuid.uuid4()),
            "coaltype": coal_use['coaltype'],
            "gcv": coal_use['gcv'],
            "burntamount": coal_use['burntamount'],
            "carbonemission": coal_use['carbonemission'],
            "plf": plf,
            "production": production,
            "totalemission": total_emission,
            "createdAt": timestamp,
            "updatedAt": timestamp
        })

# Save to CSV
csv_filename = "./dataset/coal_train_data.csv"
with open(csv_filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["_id", "coaltype", "gcv", "burntamount", "carbonemission", "plf", "production", "totalemission", "createdAt", "updatedAt"])
    
    for entry in data:
        writer.writerow([
            entry["_id"],
            entry["coaltype"],
            entry["gcv"],
            entry["burntamount"],
            entry["carbonemission"],
            entry["plf"],
            entry["production"],
            entry["totalemission"],
            entry["createdAt"],
            entry["updatedAt"]
        ])

print(f"Data successfully saved to {csv_filename}")
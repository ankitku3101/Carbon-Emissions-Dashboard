import pandas as pd
import numpy as np

# Define the structured data based on extracted image information
data = {
    "Year": [2021, 2022, 2023, 2024],
    "Company Name": ["NTPC"] * 4,
    "Industry Type": ["Power Generation"] * 4,
    "Factory/Plant Location": ["West "] * 4,

    # Emissions Data (Annual)
    "CO2 Emissions (mil t)": [263.90, 304.08, 336.46, 353.25],
    "Emissions from Coal (mil t)": [258.82, 300.10, 333.69, 349.40],
    "Emissions from Gas (mil t)": [5.08, 3.98, 2.78, 3.85],

    # Specific Emissions
    "Specific CO2 Emission (g/kWh)": [840.25, 843.46, 842.61, 836.66],
}

df = pd.DataFrame(data)

# Define months
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

# Generate monthly variations with smooth interpolation
monthly_data = []
for i in range(len(df) - 1):
    year_start, year_end = df.iloc[i]['Year'], df.iloc[i+1]['Year']
    for j, month in enumerate(months):
        factor = j / 11  # Creates a smooth transition across months
        month_values = {col: df.iloc[i][col] * (1 - factor) + df.iloc[i+1][col] * factor for col in data if col not in ['Year', 'Company Name', 'Industry Type', 'Factory/Plant Location', 'Production Capacity (MW)']}
        month_values.update({
            "Year": year_start,
            "Month": month,
            "Company Name": df.iloc[i]["Company Name"],
            "Industry Type": df.iloc[i]["Industry Type"],
            "Factory/Plant Location": df.iloc[i]["Factory/Plant Location"],
        })
        monthly_data.append(month_values)

# Convert to DataFrame
monthly_df = pd.DataFrame(monthly_data)

# Save the structured data as a CSV file
file_path = "Emission_data_monthly_varied.csv"
monthly_df.to_csv(file_path, index=False)

print("Updated monthly emission data with realistic variations saved as 'Emission_data_monthly_varied.csv'")
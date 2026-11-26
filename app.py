import os
import requests

from dotenv import load_dotenv
from flask  import Flask, jsonify

load_dotenv()

api_key = os.getenv("OpenWeather_API_KEY")

print("API key length:" , len(api_key) if api_key else 0)

app = Flask(__name__)

def get_weather(city):
    url ="https://api.openweathermap.org/data/2.5/weather"
    
    params = {
        "q": city,
        "appid": api_key,
        "units": "metric"
    }
    
    response = requests.get(url,params=params,timeout=10)
    response.raise_for_status()
    
    data = response.json()
    
    
    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity" : data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"],
        "rain": data.get("rain", {}.get("1h",0))
        
        
    }
    
@app.route("/")
def home():
    return "Rwanda Weather Checker"

@app.route("/weather/<city>")
def weather_route(city):
    try:
        return jsonify(get_weather(city))
        
    except requests.exceptions.HTTPError:
        return jsonify({"error": "City not found or API request failed"}), 404
    except requests.exceptions.RequestException:
        return jsonify({"error": "Could not connect to weather API"}), 502
        
if __name__ == "__main__":
            app.run()
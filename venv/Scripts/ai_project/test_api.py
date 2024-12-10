import requests

url = "http://127.0.0.1:8000/api/update-file/"
data = {
    "file_name": "example.jpg",
    "is_image": True
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())

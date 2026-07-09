from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
async def get_dashboard():
    return {
        "statistics": {
            "temperature": {
                "value": 29.3,
                "status": "Optimal",
                "trend": "up",
                "trendLabel": "+0.3°C"
            },
            "humidity": {
                "value": 81.2,
                "status": "Optimal",
                "trend": "down",
                "trendLabel": "-1.2%"
            },
            "soil": {
                "value": 68.5,
                "status": "Optimal",
                "trend": "up",
                "trendLabel": "+2.1%"
            },
            "light": {
                "value": 12450,
                "status": "Optimal",
                "trend": "up",
                "trendLabel": "+150 lux"
            }
        },
        "health": {
            "score": 92
        },
        "charts": {
            "temperature": [],
            "humidity": [],
            "soil": [],
            "light": [],
            "rain": []
        },
        "panel": {
            "rain": {
                "status": "Tidak Hujan",
                "intensity": 0,
                "updatedAt": None
            }
        },
        "sensorNodes": []
    }
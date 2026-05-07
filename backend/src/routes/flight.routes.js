import { Router } from "express";
import * as flightController from "../controllers/flight.controller.js";

const router = Router();

router.get("/popular-destinations", flightController.getPopularDestinations);
router.get("/destination-country", flightController.getDestinationCountryData);
router.get("/map-data", flightController.getMapData);
router.get("/locations", flightController.searchLocations);
router.post("/search", flightController.searchFlights);

export default router;

import express from "express";
import jwt from "jsonwebtoken";
import Worker from "../models/workerModel.js";
import User from "../models/authModel.js";

const router = express.Router();

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Authorization required" });
		const token = authHeader.split(" ")[1];
		const secret = process.env.JWT_SECRET || "dev_jwt_secret";
		const payload = jwt.verify(token, secret);
		req.user = payload; // { id, email, role }
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
};

// Create or update worker profile for authenticated user
router.post("/profile", authMiddleware, async (req, res) => {
	try {
		const { fullName, city, experience, hourlyRate, bio, services, image } = req.body;
		// Only workers may create a worker profile
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ error: "User not found" });
		if (user.role !== "worker") return res.status(403).json({ error: "Only users with role 'worker' can create a worker profile" });

		const workerData = {
			user: user._id,
			fullName: fullName || user.fullName,
			city: city || "",
			experience: Number(experience) || 0,
			hourlyRate: Number(hourlyRate) || 0,
			bio: bio || "",
			services: Array.isArray(services) ? services : [],
			profileCompleted: true,
			image: image || null,
		};

		let worker = await Worker.findOne({ user: user._id });
		if (worker) {
			// update
			worker = await Worker.findOneAndUpdate({ user: user._id }, workerData, { new: true, runValidators: true });
		} else {
			worker = new Worker(workerData);
			await worker.save();
		}

		return res.status(200).json({ success: true, worker });
	} catch (err) {
		console.error("worker profile error:", err && err.message ? err.message : err);
		return res.status(500).json({ error: "Error saving worker profile" });
	}
});

// Get workers list (optional filter by service)
router.get("/", async (req, res) => {
	try {
		const service = req.query.service; // plumber, electrician, etc.
		const query = { profileCompleted: true };
		if (service) query.services = service.toLowerCase();

		const workers = await Worker.find(query).select("fullName city experience hourlyRate bio services image rating reviews user").lean();

		// Attach small user info (role/name) if needed
		const results = workers.map((w) => ({
			id: w._id,
			name: w.fullName,
			city: w.city,
			experience: w.experience,
			hourlyRate: w.hourlyRate,
			bio: w.bio,
			services: w.services,
			image: w.image || "/placeholder.svg",
			rating: w.rating || 0,
			reviews: w.reviews || 0,
		}));

		return res.status(200).json({ success: true, workers: results });
	} catch (err) {
		console.error("get workers error:", err && err.message ? err.message : err);
		return res.status(500).json({ error: "Error fetching workers" });
	}
});

export default router;

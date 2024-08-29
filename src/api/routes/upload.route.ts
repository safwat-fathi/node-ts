import { Router } from "express";

import { upload } from "@/config/upload.config";

const uploads = Router();

// * Upload Single
// * ----------
uploads.post(
	"/single",
	// verifyToken,
	upload.single("file")
	// checkFileExist
	// uploadSingle
);
// uploads.post("/single", verifyToken, upload.single("file"), uploadHandler);

export default uploads;

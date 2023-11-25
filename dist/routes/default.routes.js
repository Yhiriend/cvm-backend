"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const default_controller_1 = require("../controllers/default.controller");
const router = (0, express_1.Router)();
router.get('/', default_controller_1.getDefault);
exports.default = router;

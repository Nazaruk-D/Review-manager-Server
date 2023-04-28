"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFormData = void 0;
function parseFormData(formData) {
    const obj = {};
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            obj[key] = value;
        }
        else {
            obj[key] = value || '';
        }
    }
    return obj;
}
exports.parseFormData = parseFormData;

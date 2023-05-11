"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewTags = void 0;
const addTags_1 = require("./add/addTags");
const deleteTags_1 = require("./delete/deleteTags");
function updateReviewTags(tags, reviewId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, deleteTags_1.deleteTags)(reviewId);
        if (tags && tags.length > 0) {
            yield (0, addTags_1.addTags)(tags, reviewId);
        }
    });
}
exports.updateReviewTags = updateReviewTags;

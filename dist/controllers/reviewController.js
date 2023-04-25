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
const supabase_1 = require("../supabase");
const firebase_1 = require("../utils/firebase");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const storage_1 = require("firebase/storage");
class reviewController {
    getUserReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const { data: reviews, error: reviewError } = yield supabase_1.supabase
                .from('reviews')
                .select('*')
                .eq('author_id', userId);
            if (reviewError) {
                console.error(reviewError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const reviewIds = reviews.map(review => review.id);
            const { data: tags, error: tagsError } = yield supabase_1.supabase
                .from('tags')
                .select('*, review_tags(review_id).tag_id(name)')
                .in('review_tags.review_id', reviewIds);
            if (tagsError) {
                console.error(tagsError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const { data: likes, error: likesError } = yield supabase_1.supabase
                .from('likes')
                .select('*')
                .in('review_id', reviewIds);
            if (likesError) {
                console.error(likesError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const { data: ratings, error: ratingsError } = yield supabase_1.supabase
                .from('ratings')
                .select('*, users:user_id(*)')
                .in('review_id', reviewIds);
            if (ratingsError) {
                console.error(ratingsError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const reviewsWithData = reviews.map((review) => {
                const reviewTags = tags.filter((tag) => tag.review_tags.find((rt) => rt.review_id === review.id));
                const reviewLikes = likes.filter(like => like.review_id === review.id);
                const reviewRatings = ratings.filter(rating => rating.review_id === review.id);
                return Object.assign(Object.assign({}, review), { tags: reviewTags.map((tag) => tag.name), likes: reviewLikes, ratings: reviewRatings });
            });
            res.status(200).json({ message: 'Reviews', data: reviewsWithData, code: 200 });
        });
    }
    getReviewById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            const { data: review, error: reviewError } = yield supabase_1.supabase
                .from('reviews')
                .select('*')
                .eq('id', reviewId)
                .single();
            if (reviewError) {
                console.error(reviewError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const { data: tags, error: tagsError } = yield supabase_1.supabase
                .from('review_tags')
                .select('tag_id')
                .eq('review_id', reviewId);
            if (tagsError) {
                console.error(tagsError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const tagIds = tags.map((tag) => tag.tag_id);
            const { data: tagData, error: tagDataError } = yield supabase_1.supabase
                .from('tags')
                .select('name')
                .in('id', tagIds);
            if (tagDataError) {
                console.error(tagDataError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            const tagNames = tagData.map((tag) => tag.name);
            review.tags = tagNames;
            res.status(200).json({ message: 'Review', data: Object.assign({}, review), code: 200 });
        });
    }
    getLatestReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: reviews, error: reviewsError } = yield supabase_1.supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);
            if (reviewsError) {
                console.error(reviewsError);
                res.status(500).json({ message: 'Internal server error', code: 500 });
                return;
            }
            for (let i = 0; i < reviews.length; i++) {
                const review = reviews[i];
                const { data: tags, error: tagsError } = yield supabase_1.supabase
                    .from('review_tags')
                    .select('tag_id')
                    .eq('review_id', review.id);
                if (tagsError) {
                    console.error(tagsError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const tagIds = tags.map((tag) => tag.tag_id);
                const { data: tagData, error: tagDataError } = yield supabase_1.supabase
                    .from('tags')
                    .select('name')
                    .in('id', tagIds);
                if (tagDataError) {
                    console.error(tagDataError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const tagNames = tagData.map((tag) => tag.name);
                review.tags = tagNames;
                const { data: ratings, error: ratingsError } = yield supabase_1.supabase
                    .from('ratings')
                    .select('*')
                    .eq('review_id', review.id);
                if (ratingsError) {
                    console.error(ratingsError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const ratingScores = ratings.map((rating) => rating.value);
                const ratingUsers = ratings.map((rating) => rating.user_id);
                const avgRating = ratingScores.reduce((acc, curr) => acc + curr, 0) / ratingScores.length;
                review.avgRating = avgRating;
                review.ratingUsers = ratingUsers;
            }
            res.status(200).json({ message: 'Last three reviews', data: reviews, code: 200 });
        });
    }
    getPopularTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase.from('tags')
                .select('name, review_tags!inner(tag_id)');
            if (error) {
                console.log("error");
                return [];
            }
            const sortData = data.sort((a, b) => {
                const aLength = Array.isArray(a.review_tags) ? a.review_tags.length : 0;
                const bLength = Array.isArray(b.review_tags) ? b.review_tags.length : 0;
                return bLength - aLength;
            });
            const popularTags = sortData.slice(0, 15).map(t => t.name);
            res.status(200).json({ message: 'Popular tags', data: popularTags, code: 200 });
        });
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                upload.single('reviewImage')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const file = req.file;
                    const { title, review_title, body, category, assessment, author_id, tags, author_name } = req.body;
                    let downloadURL;
                    let newReviewId;
                    if (file) {
                        const storageRef = (0, storage_1.ref)(firebase_1.storage, `review-manager/${author_id}/${file.originalname}`);
                        const metadata = { contentType: file.mimeType };
                        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
                        downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
                        const { data, error } = yield supabase_1.supabase
                            .from('reviews')
                            .insert({ title, review_title, body, category, assessment, author_id, author_name, image: downloadURL })
                            .select('id')
                            .single();
                        if (error) {
                            console.log(error);
                        }
                        newReviewId = data.id;
                    }
                    else {
                        const { data, error } = yield supabase_1.supabase
                            .from('reviews')
                            .insert({ title, review_title, body, category, assessment, author_id, author_name })
                            .select('id')
                            .single();
                        if (error) {
                            console.log(error);
                            return;
                        }
                        newReviewId = data.id;
                    }
                    if (tags && tags.length > 0) {
                        const tagIds = yield Promise.all(tags.map((tag) => __awaiter(this, void 0, void 0, function* () {
                            const { data, error } = yield supabase_1.supabase
                                .from('tags')
                                .select('id')
                                .eq('name', tag)
                                .single();
                            if (!data) {
                                const { data, error: tagError } = yield supabase_1.supabase
                                    .from('tags')
                                    .insert({ name: tag })
                                    .select('id')
                                    .single();
                                if (tagError)
                                    throw tagError;
                                return data === null || data === void 0 ? void 0 : data.id;
                            }
                            return data.id;
                        })));
                        const reviewTagInserts = tagIds.map((tagId) => {
                            return { review_id: newReviewId, tag_id: tagId };
                        });
                        const { error: reviewTagError } = yield supabase_1.supabase
                            .from('review_tags')
                            .insert(reviewTagInserts);
                        if (reviewTagError)
                            throw reviewTagError;
                    }
                    res.status(201).json({ message: 'Review added', data: req.body, code: 201 });
                }));
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Logout error', code: 400 });
            }
        });
    }
    setRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, reviewId, value } = req.body;
                const { data, error } = yield supabase_1.supabase
                    .from('ratings')
                    .insert({ value, review_id: reviewId, user_id: userId });
                if (error) {
                    throw error;
                }
                res.status(200).json({ message: 'Set rating', code: 200 });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Logout error', code: 400 });
            }
        });
    }
}
module.exports = new reviewController();
;

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
const getUsersByLikes_1 = require("../utils/getUsersByLikes");
const getUsersByRatings_1 = require("../utils/getUsersByRatings");
class reviewController {
    getUserReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                const { data: likes, error: likesError } = yield supabase_1.supabase
                    .from('likes')
                    .select('*')
                    .in('review_id', reviewIds);
                if (likesError) {
                    console.error(likesError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const reviewsWithData = reviews.map((review) => {
                    const reviewLikes = likes.filter(like => like.review_id === review.id);
                    return Object.assign(Object.assign({}, review), { likes: reviewLikes });
                });
                res.status(200).json({ message: 'Reviews', data: reviewsWithData, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getReviewById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                const { data: likes, error: likesError } = yield supabase_1.supabase
                    .from('likes')
                    .select('user_id')
                    .eq('review_id', review.id);
                if (likesError) {
                    console.error(likesError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const usersLiked = likes.map(like => like.user_id);
                review.likes = usersLiked;
                res.status(200).json({ message: 'Review', data: Object.assign({}, review), code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    deleteReviewById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewId = req.body.reviewId;
                const { data: reviewTagsToDelete, error: reviewTagsError } = yield supabase_1.supabase
                    .from('review_tags')
                    .select('*')
                    .eq('review_id', reviewId);
                if (reviewTagsError)
                    return res.status(500).json({
                        message: 'Error deleting review tags',
                        error: reviewTagsError
                    });
                if (reviewTagsToDelete && reviewTagsToDelete.length > 0) {
                    const { error: deleteReviewTagsError } = yield supabase_1.supabase
                        .from('review_tags')
                        .delete()
                        .eq('review_id', reviewId);
                    if (deleteReviewTagsError)
                        return res.status(500).json({
                            message: 'Error deleting review tags',
                            error: deleteReviewTagsError
                        });
                }
                const { data: ratingsToDelete, error: ratingsError } = yield supabase_1.supabase
                    .from('ratings')
                    .select('*')
                    .eq('review_id', reviewId);
                if (ratingsError)
                    return res.status(500).json({ message: 'Error deleting ratings', error: ratingsError });
                if (ratingsToDelete && ratingsToDelete.length > 0) {
                    const { error: deleteRatingsError } = yield supabase_1.supabase
                        .from('ratings')
                        .delete()
                        .eq('review_id', reviewId);
                    if (deleteRatingsError)
                        return res.status(500).json({
                            message: 'Error deleting ratings',
                            error: deleteRatingsError
                        });
                }
                const { data: commentsToDelete, error: commentsError } = yield supabase_1.supabase
                    .from('comments')
                    .select('*')
                    .eq('review_id', reviewId);
                if (commentsError)
                    return res.status(500).json({ message: 'Error deleting comments', error: commentsError });
                if (commentsToDelete && commentsToDelete.length > 0) {
                    const { error: deleteCommentsError } = yield supabase_1.supabase
                        .from('comments')
                        .delete()
                        .eq('review_id', reviewId);
                    if (deleteCommentsError)
                        return res.status(500).json({
                            message: 'Error deleting comments',
                            error: deleteCommentsError
                        });
                }
                const { data: likesToDelete, error: likesError } = yield supabase_1.supabase
                    .from('likes')
                    .select('*')
                    .eq('review_id', reviewId);
                if (likesError)
                    return res.status(500).json({ message: 'Error deleting likes', error: likesError });
                if (likesToDelete && likesToDelete.length > 0) {
                    const { error: deleteLikesError } = yield supabase_1.supabase
                        .from('likes')
                        .delete()
                        .eq('review_id', reviewId);
                    if (deleteLikesError)
                        return res.status(500).json({
                            message: 'Error deleting likes',
                            error: deleteLikesError
                        });
                }
                const { data: deleteReview, error: deleteReviewError } = yield supabase_1.supabase
                    .from('reviews')
                    .delete()
                    .match({ id: reviewId });
                if (deleteReviewError) {
                    throw deleteReviewError;
                }
                res.status(200).json({ message: 'Review deletion was successful', code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getLatestReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                    const likedUserIds = yield (0, getUsersByLikes_1.getUsersByLikes)(review.id);
                    const ratedUserIds = yield (0, getUsersByRatings_1.getUsersByRatings)(review.id);
                    review.likes = likedUserIds;
                    review.ratings = ratedUserIds;
                }
                res.status(200).json({ message: 'Last three reviews', data: reviews, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getPopularReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: rev, error: reviewsError } = yield supabase_1.supabase
                    .from('reviews')
                    .select('*');
                if (reviewsError) {
                    console.error(reviewsError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const reviews = rev.sort((a, b) => b.avgRating - a.avgRating).slice(0, 3);
                for (let i = 0; i < reviews.length; i++) {
                    const review = reviews[i];
                    const likedUserIds = yield (0, getUsersByLikes_1.getUsersByLikes)(review.id);
                    const ratedUserIds = yield (0, getUsersByRatings_1.getUsersByRatings)(review.id);
                    review.likes = likedUserIds;
                    review.ratings = ratedUserIds;
                }
                res.status(200).json({ message: 'Most popular three reviews', data: reviews, code: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    getPopularTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
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
                    let { author_id, title, review_title, body, category, assessment, tags, author_name } = req.body;
                    let downloadURL;
                    let newReviewId;
                    if (file) {
                        const storageRef = (0, storage_1.ref)(firebase_1.storage, `review-manager/${author_id}/${file.originalname}`);
                        const metadata = { contentType: file.mimeType };
                        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
                        downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
                        const { data, error } = yield supabase_1.supabase
                            .from('reviews')
                            .insert({
                            title,
                            review_title,
                            body,
                            category,
                            assessment,
                            author_id,
                            author_name,
                            image: downloadURL
                        })
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
                    if (typeof tags === 'string') {
                        tags = tags.split(',');
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
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                upload.single('reviewImage')(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    const file = req.file;
                    let { author_id, reviewId, title, review_title, body, category, assessment, tags, author_name, } = req.body;
                    let downloadURL;
                    if (file) {
                        const storageRef = (0, storage_1.ref)(firebase_1.storage, `review-manager/${author_id}/${file.originalname}`);
                        const metadata = { contentType: file.mimeType };
                        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
                        downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
                    }
                    const { data, error } = yield supabase_1.supabase
                        .from('reviews')
                        .update({
                        title,
                        review_title,
                        body,
                        category,
                        assessment,
                        author_id,
                        author_name,
                        image: downloadURL,
                    })
                        .eq('id', reviewId)
                        .single();
                    if (error) {
                        console.log(error);
                        return res.status(400).json({
                            message: 'Review update error',
                            code: 400,
                        });
                    }
                    if (typeof tags === 'string') {
                        tags = tags.split(',');
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
                        const reviewTagDeletes = yield supabase_1.supabase
                            .from('review_tags')
                            .delete()
                            .eq('review_id', reviewId);
                        if (reviewTagDeletes.error)
                            throw reviewTagDeletes.error;
                        const reviewTagInserts = tagIds.map((tagId) => {
                            return { review_id: reviewId, tag_id: tagId };
                        });
                        const { error: reviewTagError } = yield supabase_1.supabase
                            .from('review_tags')
                            .insert(reviewTagInserts);
                        if (reviewTagError)
                            throw reviewTagError;
                    }
                    else {
                        const reviewTagDeletes = yield supabase_1.supabase
                            .from('review_tags')
                            .delete()
                            .eq('review_id', reviewId);
                        if (reviewTagDeletes.error)
                            throw reviewTagDeletes.error;
                    }
                    res.status(200).json({ message: 'Review updated', data, code: 200 });
                }));
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Review update error', code: 400 });
            }
        });
    }
    setRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, reviewId, value } = req.body;
                const { data: existingRating, error: existingRatingError } = yield supabase_1.supabase
                    .from('ratings')
                    .select('id, value')
                    .eq('review_id', reviewId)
                    .eq('user_id', userId)
                    .single();
                if (existingRating) {
                    const { data: updatedRating, error: updatedRatingError } = yield supabase_1.supabase
                        .from('ratings')
                        .update({ value })
                        .eq('id', existingRating.id)
                        .single();
                    if (updatedRatingError) {
                        console.error(updatedRatingError);
                        res.status(500).json({ message: 'Internal server error', code: 500 });
                        return;
                    }
                }
                else {
                    const { data, error } = yield supabase_1.supabase
                        .from('ratings')
                        .insert({ value, review_id: reviewId, user_id: userId });
                    if (error) {
                        throw error;
                    }
                }
                const { data: reviews, error: reviewsError } = yield supabase_1.supabase
                    .from('reviews')
                    .select('*, ratings(value)')
                    .eq('id', reviewId);
                if (reviewsError) {
                    console.error(reviewsError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                const review = reviews[0];
                const ratingValues = review.ratings.map((rating) => rating.value);
                const avgRating = ratingValues.reduce((acc, curr) => acc + curr, 0) / ratingValues.length;
                const { data: updatedReview, error: updatedReviewError } = yield supabase_1.supabase
                    .from('reviews')
                    .update({ avg_rating: avgRating })
                    .eq('id', reviewId)
                    .single();
                if (updatedReviewError) {
                    console.error(updatedReviewError);
                    res.status(500).json({ message: 'Internal server error', code: 500 });
                    return;
                }
                res.status(200).json({ message: 'Set rating', code: 200 });
            }
            catch (e) {
                console.error(e);
                res.status(400).json({ message: 'Logout error', code: 400 });
            }
        });
    }
    changeLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, reviewId } = req.body;
                const { data: existingLike, error } = yield supabase_1.supabase
                    .from('likes')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('review_id', reviewId)
                    .single();
                if (existingLike === null) {
                    const { data: newLike, error: insertError } = yield supabase_1.supabase
                        .from('likes')
                        .insert({ user_id: userId, review_id: reviewId })
                        .single();
                    if (insertError) {
                        throw insertError;
                    }
                    res.status(200).json({ message: 'Like added', code: 200 });
                }
                else {
                    const { data: deletedLike, error: deleteError } = yield supabase_1.supabase
                        .from('likes')
                        .delete()
                        .eq('id', existingLike.id)
                        .single();
                    if (deleteError) {
                        throw deleteError;
                    }
                    res.status(200).json({ message: 'Like removed', code: 200 });
                }
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Logout error', code: 400 });
            }
        });
    }
}
module.exports = new reviewController();

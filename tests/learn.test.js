const request = require('supertest');
const app = require('../src/app');
const LearningTrack = require('../src/models/LearningTrack');

describe('GET /api/learn/tracks', () => {
    test('is public and empty when nothing is seeded', async () => {
        const res = await request(app).get('/api/learn/tracks');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('returns tracks with a lessonCount, ordered by order', async () => {
        await LearningTrack.create({
            slug: 'second',
            title: 'Second',
            order: 2,
            lessons: ['a'],
        });
        await LearningTrack.create({
            slug: 'first',
            title: 'First',
            order: 1,
            lessons: ['a', 'b', 'c'],
        });

        const res = await request(app).get('/api/learn/tracks');
        expect(res.status).toBe(200);
        expect(res.body.map((t) => t.slug)).toEqual(['first', 'second']);
        expect(res.body[0].lessonCount).toBe(3);
        expect(res.body[1].lessonCount).toBe(1);
    });
});

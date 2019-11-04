const mongoose = require('mongoose');
const { Note } = require('../../models/note.model');
const request = require('supertest');
const _ = require('lodash');

const endpoint = '/api/notes';

let app;
let id0;
let id1;
let note0;
let note1;

describe(endpoint, () => {
  afterAll(async () => {
    mongoose.disconnect();
  });

  describe('get', () => {
    beforeEach(async () => {
      app = require('../../app');

      id0 = mongoose.Types.ObjectId();
      id1 = mongoose.Types.ObjectId();

      note0 = new Note({
        _id: id0,
        text: 'First testing note.'
      });

      note1 = new Note({
        _id: id1,
        text: 'Second testing note.'
      });

      await Note.insertMany([note0, note1]);
    });

    afterEach(async () => {
      await Note.deleteMany({});
      app.close();

    });

    it('all should return the list of all notes.', async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toContain(id0);
      expect(response.body[0].text).toContain('First testing note.');
      expect(response.body[0].aaddedAt).not.toBeNull();
    });

    it(`one should return 404 with invalid error if note ID is invalid.`, async () => {
      const response = await request(app).get(`${endpoint}/1`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Invalid');
    });

    it(`one should return 404 if note with the id doesn't exists.`, async () => {
      const response = await request(app).get(endpoint + '/' + mongoose.Types.ObjectId());

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('does not exists');
    });

    it(`one should return note with specified`, async () => {
      const response = await request(app).get(`${endpoint}/${id1}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toContain(id1);
      expect(response.body.text).toContain(note1.text);
      expect(response.body.aaddedAt).not.toBeNull();
    });
  });

  describe('post', () => {
    beforeEach(async () => {
      app = require('../../app');
      id0 = mongoose.Types.ObjectId();

      note0 = new Note({
        _id: id0,
        text: 'First testing note.'
      });

    });

    afterEach(async () => {
      await Note.deleteMany({});
      app.close();

    });

    it(`should create new note and return it as a response`, async () => {
      const response = await request(app)
        .post(endpoint)
        .send(_.pick(note0, ['text']));

      expect(response.status).toBe(201);
      expect(response.body._id).not.toBeNull()
      expect(response.header).not.toBeNull();
    });

    it(`should reject with status 400 and missing text error message`, async () => {
      const response = await request(app)
        .post(endpoint)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('"text" is required');
    });

    it(`should reject with status 400 and "text" min length error`, async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ text: 'ab' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must be at least 3 characters long');
    })

    it(`should reject with status 400 and "text" exceeding max length error`, async () => {
      const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    It has survived not only five centuries, but also the leap into electronic typesetting,
    remaining essentially unchanged.
    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
    and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

      const response = await request(app)
        .post(endpoint)
        .send({ text });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('length must be less than or equal to 120 characters long');
    });

  });

  describe('delete', () => {
    beforeEach(async () => {
      app = require('../../app');

      id0 = mongoose.Types.ObjectId();
      id1 = mongoose.Types.ObjectId();

      note0 = new Note({
        _id: id0,
        text: 'First testing note.'
      });

      note1 = new Note({
        _id: id1,
        text: 'Second testing note.'
      });

      await Note.insertMany([note0, note1]);
    });

    afterEach(async () => {
      await Note.deleteMany({});
      app.close();

    });

    it('should return 404 with invalid note ID error', async () => {
      const response = await request(app).delete(`${endpoint}/1`);

      expect(response.status).toBe(404);
      expect(response.body.error.toLowerCase()).toContain('invalid note id');
    });

    it('should return 404 with does not exists error', async () => {
      const response = await request(app).delete(`${endpoint}/${mongoose.Types.ObjectId()}`);

      expect(response.status).toBe(404);
      expect(response.body.error.toLowerCase()).toContain('does not exists');
    });

    it('should delete a note and return 200 status code', async () => {
      const response = await request(app).delete(`${endpoint}/${id1}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('successfully deleted');
    });

  });

  describe('put', () => {
    beforeEach(async () => {
      app = require('../../app');
      id0 = mongoose.Types.ObjectId();

      note0 = new Note({
        _id: id0,
        text: 'First testing note.'
      });

      await Note.insertMany([note0, note1]);
    });

    afterEach(async () => {
      await Note.deleteMany({});
      app.close();

    });

    it('should return 400 with invalid note ID', async () => {
      const response = await request(app)
        .put(endpoint)
        .send({ _id: '1', text: 'ab' });

      expect(response.status).toBe(400);
      expect(
        response.body.error.toLowerCase()
          .includes('length must be at least 10 characters long') ||
        response.body.error.toLowerCase()
          .includes('Invalid note ID')
      ).toBeTruthy();
    });

    it('should return 400 if there\'s invalid or no text property in the object', async () => {
      const response = await request(app)
        .put(endpoint)
        .send({ _id: mongoose.Types.ObjectId() });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('"text" is required');
    });

    it('should modify the note and return the updated one', async () => {
      note0.text = 'Modified testing note';

      const response = await request(app)
        .put(endpoint)
        .send(note0);

      expect(response.status).toBe(200);
      expect(response.body._id).toContain(note0._id);
      expect(response.body.text).toContain('Modified testing note');
    });
  })
});

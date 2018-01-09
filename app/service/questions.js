const Table = Symbol('Questions#table');

module.exports = app => {

    const Base = require('./base')(app);

    class Questions extends Base {

        // Constructure of table questions
        get table() {
            if (!this[Table]) {
                this[Table] = {
                    id: undefined,
                    name: undefined,
                    link: undefined,
                    count: undefined
                }
            }

            return this[Table];
        }


        // Judge question record exists or not
        async exists(name) {
            
            // parameter name doesn't exist
            if (!this._parameterExists(name)) {
                return false;
            }

            try {
                // question record exists
                if (await this._count('questions', 'id', { name })=== 1) {
                    return true;
                }

                // question record doesn't exist
                return false;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Add a new question record to table questions
        async insert(question) {

            // format question's attributes to table questions
            question = this._formatTableValue(this.table, question);

            // question's name and link doesn't exist
            if (!question.name || !question.link) {
                return false;
            }

            // question record specified by name has existed
            if (await this.exists(question.name)) {
                return false;
            }

            // insert a new question record to table questions
            try {
                await this._insert('questions', question);
                return true;
            } catch (err) {
                this.logger.error(question);
                return false;
            }
        }


        // Plus one to some question record's count
        async addCount(name) {

            // question specified by name doesn't exists
            if (!await this.exists(name)) {
                return false;
            }

            // plus one to count
            try {
                const count = await this._count('questions', 'count', { name });
                ++count;
                await this._update('questions', { count }, { name });
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }


        // Delete question with least count
        async deleteLatest() {
            
            try {

                // get the question name with least count 
                const str = `select name from questions where count = 
                                (select min(count) from questions
                                where stable = false)`;
                let name = await this.app.db.query(str, []);
                name = name[0] && name[0].name;

                // name doesn't exist
                if (!this._parameterExists(name)) {
                    return;
                }

                // delete the question with least count
                await this._delete('questions', { name });
                return true;
            } catch (err) {
                this.logger.error(err);
                return false;
            }
        }
    }

    return Questions;
}
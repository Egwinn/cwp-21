const CrudService = require('./crud');
const validator = require('../helpers/validator');

class OfficesService extends CrudService {

    constructor(repository, agentsRepository, schema, errors) {
        super(repository, errors);

        this.agentsRepository = agentsRepository;
        this.schema = schema;
    }

    async create(data) {
        let validCheck = validator(this.schema, data);
        if (!validCheck.isValid)
            throw this.errors.validError(validCheck.errors);

        super.create(data);
    }

    async update(data) {
        let validCheck = validator(this.schema, data);
        if (!validCheck.isValid)
            throw this.errors.validError(validCheck.errors);

        return super.update(data.id, data);
    }

    async delete(id) {
        await this.agentsRepository.update(
            {
                officeId: null,
            },
            {
                where: {
                    officeId: id,
                },
            }
        );

        super.delete(id);
    }

    async readAgents(officeId, options) {
        options = {
            limit: Number(options.limit) || this.defaults.readChunk.limit,
            offset: Number(options.offset) || this.defaults.readChunk.offset
        };

        const office = await this.repository.findById(officeId);

        if (!office) {
            throw this.errors.notFound;
        }

        let agents = await this.agentsRepository.findAll({
            where: {
                officeId: officeId,
            },
            limit: options.limit,
            offset: options.offset,
            raw: true,
        });

        return agents;
    }

}

module.exports = OfficesService;
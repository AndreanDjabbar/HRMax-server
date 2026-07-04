import MasterRepository from "../repository/master.repository.js";

class MasterService {
    static async getCountries() {
        const countries = await MasterRepository.getCountries();
        return countries;
    }
}

export default MasterService;
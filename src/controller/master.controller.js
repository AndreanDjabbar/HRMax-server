import MasterService from "../service/master.service.js";
import { responseSuccess } from "../util/response.util.js";

export const getCountriesController = async (req, res) => {
    const countries = await MasterService.getCountries();
    return responseSuccess(
        res,
        200,
        "Countries retrieved successfully",
        "data",
        {
            countries: countries
        }
    );
};

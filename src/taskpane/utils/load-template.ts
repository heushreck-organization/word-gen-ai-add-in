import axios from 'axios';
import get_json_response from './json-response';

interface QAResponse {
    id: number;
    q: string;
    search_string: string;
}


interface XMLResponse {
    xml: string;
    qa: QAResponse[];
}

async function fetchXMLData(url: string): Promise<Object> {
    try {
        const response = await axios.get(url);
        const data = response.data;
        // convert json data to dict
        console.log('Data:', data);
        return data;
    } catch (error) {
        console.error('Error while fetching data:', error);
        throw error;
    }
}

const loadTemplate = async (text: string) => {
    var qa = [];
    
    // return [{ id: 1, q: "What Date?", search_string: "dd/mm/yyyy" }, { id: 2, q: "Whats your name?", search_string: "Your Name" }, { id: 3, q: "Whats your age?", search_string: "Your Age" }, {id: 4, q: "Whats your address?", search_string: "Your Address"}, {id: 5, q: "Whats your phone number?", search_string: "Your Phone Number"}]
    try {
        await Word.run(async (context) => {
            console.log("Loading template: " + text);
            // TODO: replace the url with the correct one
            // const url = "https://localhost:3001/xml";
            // const data = await fetchXMLData(url);
            // casr the data to XMLResponse

            const data = get_json_response();

            const xml = (data as XMLResponse).xml;
            let body = context.document.body;
            body.clear();
            await context.sync();
            body.insertOoxml(xml, Word.InsertLocation.end);
            qa = (data as XMLResponse).qa;
        });
    } catch (error) {
        console.log("Error: " + error);
    }
    return qa;
}

export default loadTemplate;
export type { QAResponse };
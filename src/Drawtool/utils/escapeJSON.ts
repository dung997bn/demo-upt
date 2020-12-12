function escapeJSON(string: String) {

    let str = string.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");

    return str;

}

export default escapeJSON;
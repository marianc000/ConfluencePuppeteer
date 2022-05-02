export function groupBy(list, keyGetter) {
    const map = {};
    function add(keyVal, val) {
        const key = keyVal || "Empty";
        if (!map[key])
            map[key] = [];
        map[key].push(val);
    }

    list.forEach(o => add(keyGetter(o), o));
    return map;
}
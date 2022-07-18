const makeTree = (xs, id) => {
    xs.filter((x) => x.p_id == id)
        .map(({ Id, Cate, p_id }, _, __, subItems = makeForest(xs, Id)) => ({
            id: Id, tittle: Cate, ... (subItems.length ? { subItems } : {})
        }));
}


module.exports = makeTree;
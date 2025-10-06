function a(b) {
    c = makeSerializable(9, b)
    d = ArrayBuffer
    e = new d
    f = []
    Object.defineProperty(f, 0, {value : e}).push(c)
    g = serialize(e, f)
    try {
        deserialize(g)
    } catch { }
    deserialize(g)
}
a(1.0)
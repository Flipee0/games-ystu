class Constraints:
    def __init__(self, create=None, read=None, update=None, delete=None):
        self.create = create
        self.read = read
        self.update = update
        self.delete = delete


class Entity:
    def __init__(self, model, scheme, constraints: Constraints):
        self.model = model
        self.scheme = scheme
        self.constraints = constraints

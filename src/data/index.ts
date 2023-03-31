

export namespace AdminData {
export class LoginData {
    constructor(public userName: string = '', public password: string = '') {
    }
    toJson(): object {
        return {
            userName: this.userName,
            password: this.password
        }
    }

    fromJson(o: object): LoginData {
        return new LoginData(
            (o as any).userName,
            (o as any).password
        )
    }
}
}
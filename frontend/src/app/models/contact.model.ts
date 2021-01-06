export class Contact {
  constructor(
    public user: string,
    public name: string,
    public email: string,
    public phone: string,
    public type: string,
    public date: string,
    public results?: string
  ) {}
}

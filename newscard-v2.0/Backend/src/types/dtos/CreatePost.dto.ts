export class CreatePostDto {
  constructor(
    public email: string,
    public cardId: string,
    public body: string | undefined,
    public link: string | undefined,
    public image: string | undefined,
  ) {}
}

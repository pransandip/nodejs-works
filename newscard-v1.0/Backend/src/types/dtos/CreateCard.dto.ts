export class CreateCardDto {
  constructor(
    public id: string | undefined,
    public email: string,
    public username: string,
    public title: string,
    public association: string,
    public cardAccess: 'Public' | 'Private' | 'FollowersOnly' | 'FollowingOnly',
    public typeOfCard: 'Actor' | 'Person' | 'Event',
    public cardRegAs: 'Regular' | 'Personal',
    public image: string,
    public tagLine: string,
  ) {}
}

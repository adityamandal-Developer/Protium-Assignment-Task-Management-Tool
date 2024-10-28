export class AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

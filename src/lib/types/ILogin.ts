export interface ILogin {
  username: string;
  passcode: string;
}


export interface ILoginSuccess {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    expirationDate: string;
    user: string;
  }
}

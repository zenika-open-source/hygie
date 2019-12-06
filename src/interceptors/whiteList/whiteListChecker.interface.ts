export interface WhiteListCheckerI {
  isAccepted(request: Request): boolean;
}

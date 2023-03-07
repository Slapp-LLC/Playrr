import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiLogIn = () => {
  return (target, property, descriptor) => {
    ApiOperation({
      summary: 'Log in with email and password',
    })(target, property, descriptor);
    ApiResponse({
      status: 200,
      description: 'Returns the token and user data',
      type: String,
    })(target, property, descriptor);
  };
};

export const ApiSignUp = () => {
  return (target, property, descriptor) => {
    ApiOperation({
      summary: 'Sign Up with email and password',
    })(target, property, descriptor);
    ApiResponse({
      status: 200,
      description: 'Returns the token and user data',
      type: String,
    })(target, property, descriptor);
  };
};

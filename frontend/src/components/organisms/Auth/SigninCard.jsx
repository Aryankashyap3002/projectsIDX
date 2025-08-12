import { LucideLoader2, TriangleAlert } from 'lucide-react';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export const SigninCard = ({
   signinForm,
   setSigninForm,
   onSigninFormSubmit,
   validationError,
   error,
   isSuccess,
   isPending
}) => {
    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-300 hover:shadow-violet-500/5">
            <CardHeader className="space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="p-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <svg className="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <CardTitle className="text-center text-2xl font-bold text-white">Sign In</CardTitle>
                <CardDescription className="text-center text-gray-400">Welcome back to your account</CardDescription>
                {validationError && (
                    <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-2 border border-destructive/20 shadow-sm'>
                        <TriangleAlert className='size-5' />
                        <p className="font-medium">{validationError.message}</p>
                    </div>
                )}

                {error && (
                    <div className='bg-destructive/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-2 border border-destructive/20 shadow-sm'>
                        <TriangleAlert className='size-5' />
                        <p className="font-medium">{error.message}</p>
                    </div>
                )}

                {isSuccess && (
                    <div className='bg-primary/15 p-4 rounded-md flex items-center gap-x-2 text-sm text-primary mb-2 border border-primary/20 shadow-sm'>  
                        <FaCheck className='size-5' />
                        <p className="font-medium">
                            Successfully signed in! Redirecting...
                            <LucideLoader2 className="animate-spin ml-2 inline-block" />
                        </p>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <form className='space-y-4' onSubmit={onSigninFormSubmit}>
                    <div className="space-y-3">
                        <Input
                            placeholder="Email"
                            required
                            onChange={(e) => setSigninForm({ ...signinForm, email: e.target.value })}
                            value={signinForm.email}
                            type="email"
                            disabled={isPending}
                            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/30"
                        />
                        <Input
                            placeholder="Password"
                            required
                            onChange={(e) => setSigninForm({ ...signinForm, password: e.target.value })}
                            value={signinForm.password}
                            type="password"
                            disabled={isPending}
                            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500/30"
                        />
                    </div>
                    <Button 
                        disabled={isPending}
                        size="lg"
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white 
                              shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 border-0 transition-all duration-300"
                    >
                        {isPending ? (
                            <div className="flex items-center justify-center">
                                <LucideLoader2 className="animate-spin mr-2" />
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <Separator className="my-5 bg-white/10" />
                
                <p className='text-sm text-muted-foreground mt-4 text-center'>
                    Don't have an account? {' '}
                    <span 
                        className='text-violet-400 hover:text-violet-300 hover:underline cursor-pointer font-medium transition-colors duration-200'
                        onClick={() => navigate('/auth/signup')}
                    >
                        Sign Up
                    </span>
                </p>
                
                {/* Added "Forgot password?" link */}
                <p className="text-gray-500 text-xs mt-4 text-center">
                    <span className="hover:text-gray-400 hover:underline cursor-pointer transition-colors duration-200">
                        Forgot password?
                    </span>
                </p>
            </CardContent>
        </Card>
    );
};
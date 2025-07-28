import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Zap, Users, Shield } from 'lucide-react';

export default async function Home() {

    const supabase = await createClient();

    try {
        const { data, error } = await supabase.auth.getUser();

        if (!error && data?.user) {
            return redirect('/dashboard');
        }
    } catch (error) {
        console.error("No session found");
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                <img alt="logo" src="/logo.png" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur opacity-30"></div>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                        PDA Ltd.
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Empowering communities with reliable power management
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link href={"/signup"} className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                            <span className="flex items-center justify-center">
                                Sign Up
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </Link>

                        <Link href={'/login'} className="px-8 py-4 border-2 border-gray-600 rounded-xl font-semibold text-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                            Login
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="group p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500/30 transition-colors">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-blue-400">Reliable Power</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Advanced monitoring and distribution systems ensure consistent power delivery to your community.
                            </p>
                        </div>

                        <div className="group p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-500/30 transition-colors">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-400">Community Focus</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Built for communities, by communities. Transparent governance and shared decision-making.
                            </p>
                        </div>

                        <div className="group p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-green-500/30 transition-colors">
                                <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-green-400">Secure Platform</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Enterprise-grade security with real-time monitoring and automated failover protection.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-200">Transforming Power Distribution</h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        PDA Ltd. bridges the gap between traditional power infrastructure and modern community needs.
                        Our platform enables local communities to take control of their energy future through smart
                        distribution networks, transparent billing, and collaborative governance. Whether you're managing
                        a residential complex, industrial zone, or rural community, our technology scales to meet your
                        unique requirements while maintaining the highest standards of reliability and security.
                    </p>
                </div>

                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
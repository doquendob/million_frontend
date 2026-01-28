import Logo from '../../../../public/logo.svg';
import Image from 'next/image';
import AreaCode from "@/components/ui/areaCodeDropdown";

const RegisterPage = () => {
    return (
        <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-6">
            <div className="text-center mb-12 sm:mb-16">
                <Image src={Logo} alt="Real Estate Logo" className="mx-auto h-40 w-40" />
                <h4 className="text-slate-600 text-base mt-6">Sign up into your account</h4>
            </div>

            <form>
                <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">First Name</label>
                        <input name="name" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300" placeholder="Enter your first name" />
                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Last Name</label>
                        <input name="lname" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300" placeholder="Enter your last name" />
                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Email Id</label>
                        <input name="email" type="text" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Mobile No.</label>
                        <div className="flex gap-2">
                            <AreaCode />
                            <input name="number" type="tel" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300" placeholder="Enter mobile number" />
                        </div>
                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Password</label>
                        <input name="password" type="password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300" placeholder="Enter password" />
                    </div>
                    <div>
                        <label className="text-slate-900 text-sm font-medium mb-2 block">Confirm Password</label>
                        <input name="cpassword" type="password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border border-gray-300" placeholder="Enter confirm password" />
                    </div>
                </div>

                <div className="mt-12">
                    <button type="button" className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium tracking-wider rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, CreditCard, GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { register as registerService } from '../services/authService';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    roll_number: '',
    branch: '',
    year: '',
    semester: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.display_name.trim()) newErrors.display_name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.roll_number.trim()) newErrors.roll_number = 'Roll Number is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.semester) newErrors.semester = 'Semester is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const data = await registerService({
        ...formData,
        roll_number: formData.roll_number.toUpperCase()
      });
      
      toast.success(`Welcome to GPCET CampusIQ, ${data.user.display_name}!`);
      login(data.user, data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message);
      if (message.toLowerCase().includes('email')) {
        setErrors({ email: message });
      } else if (message.toLowerCase().includes('roll number')) {
        setErrors({ roll_number: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roll_number' ? value.toUpperCase() : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gpcet-bg flex flex-col md:flex-row text-gpcet-text font-sans">
      
      {/* Left Column - Branding (Same as Login) */}
      <div className="md:w-2/5 p-8 flex flex-col justify-center bg-gpcet-sidebar border-r border-gpcet-border relative overflow-hidden hidden md:flex">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gpcet-primary opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-gpcet-nptel opacity-5 blur-3xl"></div>

        <div className="relative z-10 max-w-md mx-auto text-center md:text-left">
          <h1 className="text-6xl font-black text-gpcet-primary tracking-tighter mb-4">
            GPCET
          </h1>
          <h2 className="text-2xl font-semibold leading-tight mb-2">
            G. Pullaiah College of <br/>Engineering and Technology
          </h2>
          <p className="text-gpcet-muted mb-6">Kurnool, Andhra Pradesh</p>
          
          <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-gpcet-card border border-gpcet-border text-xs font-medium">
              JNTUA Autonomous
            </span>
            <span className="px-3 py-1 rounded-full bg-gpcet-card border border-gpcet-border text-xs font-medium">
              NAAC A Grade
            </span>
          </div>

          <div className="w-12 h-1 bg-gpcet-border mb-8 mx-auto md:mx-0 rounded"></div>

          <p className="text-base text-gray-300 font-medium hidden lg:block">
            Join the elite community of GPCET students and experience the future of digital learning.
          </p>
        </div>
      </div>

      {/* Right Column - Register */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-4 sm:p-8 bg-gpcet-bg overflow-y-auto">
        <div className="w-full max-w-xl bg-gpcet-card p-6 sm:p-10 rounded-3xl border border-gpcet-border shadow-2xl relative overflow-hidden my-8">
          
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gpcet-primary via-gpcet-accent to-gpcet-nptel"></div>

          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-gpcet-primary text-[10px] font-black tracking-[0.2em] uppercase mb-4">
              Student Registration
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-gpcet-text italic">Create Account</h2>
            <p className="text-gpcet-muted text-xs font-medium">Get your GPCET-exclusive Smart Notes and Meera AI access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Grid for desktop layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <input
                    name="display_name"
                    type="text"
                    value={formData.display_name}
                    onChange={handleChange}
                    placeholder="e.g. Ravi Kumar"
                    className={`w-full bg-gpcet-bg border ${errors.password ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-10 text-gpcet-text placeholder-gray-700 focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  />
                </div>
                {errors.display_name && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.display_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">College Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. 23b91a0501@gpcet.ac.in"
                    className={`w-full bg-gpcet-bg border ${errors.semester ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-4 text-gpcet-text appearance-none focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.email}</p>}
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Roll Number</label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <input
                    name="roll_number"
                    type="text"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="e.g. 23B91A0501"
                    className={`w-full bg-gpcet-bg border ${errors.confirmPassword ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-10 text-gpcet-text placeholder-gray-700 focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  />
                </div>
                {errors.roll_number && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.roll_number}</p>}
              </div>

              {/* Branch */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Branch</label>
                <div className="relative group">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className={`w-full bg-gpcet-bg border ${errors.branch ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-4 text-gpcet-text appearance-none focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  >
                    <option value="" disabled>Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="CAI">CSE-AI (CAI)</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
                {errors.branch && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.branch}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Academic Year</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full bg-gpcet-bg border ${errors.year ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-4 text-gpcet-text appearance-none focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  >
                    <option value="" disabled>Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                {errors.year && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.year}</p>}
              </div>

              {/* Semester */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Current Semester</label>
                <div className="relative group">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={`w-full bg-gpcet-bg border ${errors.semester ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-4 text-gpcet-text appearance-none focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  >
                    <option value="" disabled>Select Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
                {errors.semester && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.semester}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    className={`w-full bg-gpcet-bg border ${errors.password ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-10 text-gpcet-text placeholder-gray-700 focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.1em] mb-2 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors group-focus-within:text-gpcet-primary" size={16} />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full bg-gpcet-bg border ${errors.confirmPassword ? 'border-red-500/50' : 'border-gpcet-border'} rounded-xl py-3 pl-12 pr-10 text-gpcet-text placeholder-gray-700 focus:ring-2 focus:ring-gpcet-primary/50 outline-none transition-all text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-bold">{errors.confirmPassword}</p>}
              </div>

            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gpcet-primary hover:bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[11px] py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Create GPCET Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gpcet-border/50">
            <p className="text-gray-400 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-gpcet-primary font-black hover:text-blue-400 transition-colors uppercase tracking-widest ml-1">
                Sign In
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Register;

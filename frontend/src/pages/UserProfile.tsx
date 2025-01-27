// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   Music2,
//   Calendar,
//   Music,
//   ArrowLeft,
//   UserPlus,
//   UserMinus,
// } from "lucide-react";
// import { useMoodStore } from "../store/moodStore";
// import { useAuthStore } from "../store/useAuthStore";

// export const UserProfile: React.FC = () => {
//   const { userId } = useParams();
//   const {
//     user: currentUser,
//     following,
//     followUser,
//     unfollowUser,
//     fetchUserProfile,
//   } = useAuthStore();
//   const { getUserEntries } = useMoodStore();

//   // Store profile user state
//   const [profileUser, setProfileUser] = useState<User | null>(null);

//   useEffect(() => {
//     const loadUserProfile = async () => {
//       if (userId) {
//         const user = await fetchUserProfile(userId);
//         setProfileUser(user);
//       }
//     };

//     loadUserProfile();
//   }, [userId, fetchUserProfile]);

//   // Retrieve mood entries of the profile user
//   const userEntries = getUserEntries(userId || "");

//   // Check if the current logged-in user is viewing their own profile
//   const isOwnProfile = currentUser?.id === userId;

//   // Check if the current logged-in user is following this profile
//   const isFollowing = following.includes(userId || "");

//   const handleFollowToggle = () => {
//     if (isFollowing) {
//       unfollowUser(userId || "");
//     } else {
//       followUser(userId || "");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Link
//         to="/feed"
//         className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-8 hover:text-purple-700 dark:hover:text-purple-300"
//       >
//         <ArrowLeft className="h-5 w-5" />
//         <span>Back to Feed</span>
//       </Link>

//       <div className="grid md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <Music2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 {profileUser?.name || "User"}'s Profile
//               </h3>
//             </div>
//             {!isOwnProfile && (
//               <button
//                 onClick={handleFollowToggle}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   isFollowing
//                     ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
//                     : "bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600"
//                 }`}
//               >
//                 {isFollowing ? (
//                   <>
//                     <UserMinus className="h-4 w-4" />
//                     <span>Unfollow</span>
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="h-4 w-4" />
//                     <span>Follow</span>
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
//           {/* Rest of the profile content remains the same */}
//           {/* ... */}
//         </div>
//         {/* Rest of the component remains the same */}
//         {/* ... */}
//       </div>
//     </div>
//   );
// };

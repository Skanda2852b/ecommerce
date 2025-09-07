// app/profile/page.jsx
"use client";
import {
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const [user, setUser] =
    useState(null);
  const [
    isEditing,
    setIsEditing,
  ] = useState(false);
  const [
    formData,
    setFormData,
  ] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);
  const [error, setError] =
    useState("");
  const [
    success,
    setSuccess,
  ] = useState("");
  const [
    showAvatarModal,
    setShowAvatarModal,
  ] = useState(false);
  const [
    avatarOptions,
    setAvatarOptions,
  ] = useState([]);
  const [
    selectedAvatar,
    setSelectedAvatar,
  ] = useState("");
  const [
    isGeneratingAvatars,
    setIsGeneratingAvatars,
  ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  // Generate avatar options when modal opens
  useEffect(() => {
    if (showAvatarModal) {
      generateAvatarOptions();
    }
  }, [showAvatarModal]);

  const fetchUserData =
    async () => {
      try {
        const response =
          await fetch(
            "/api/user"
          );
        if (response.ok) {
          const userData =
            await response.json();
          setUser(userData);
          setFormData({
            username:
              userData.username ||
              "",
            email:
              userData.email ||
              "",
            firstName:
              userData.firstName ||
              "",
            lastName:
              userData.lastName ||
              "",
            phone:
              userData.phone ||
              "",
            address:
              userData.address ||
              "",
            avatar:
              userData.avatar ||
              generateAvatar(
                userData.email ||
                  userData.username ||
                  "user"
              ),
          });
          setSelectedAvatar(
            userData.avatar ||
              generateAvatar(
                userData.email ||
                  userData.username ||
                  "user"
              )
          );
        } else if (
          response.status ===
          401
        ) {
          router.push(
            "/login"
          );
        } else {
          setError(
            "Failed to fetch user data"
          );
        }
      } catch (error) {
        setError(
          "An error occurred while fetching user data"
        );
      } finally {
        setIsLoading(false);
      }
    };

  // Generate a DiceBear avatar URL
  const generateAvatar =
    useCallback(
      (
        seed,
        options = {}
      ) => {
        const baseUrl =
          "https://api.dicebear.com/7.x/avataaars/svg";
        const params =
          new URLSearchParams(
            {
              seed:
                seed ||
                "user",
              radius:
                options.radius ||
                "50",
              backgroundColor:
                options.backgroundColor ||
                "b6e3f4",
              ...options,
            }
          );
        return `${baseUrl}?${params.toString()}`;
      },
      []
    );

  // Generate multiple avatar options
  const generateAvatarOptions =
    useCallback(async () => {
      setIsGeneratingAvatars(
        true
      );
      const avatarOptionsList =
        [];
      const seeds = [
        formData.username ||
          "user",
        formData.email ||
          "user",
        formData.firstName ||
          "user",
        formData.lastName ||
          "user",
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
        Math.random()
          .toString(36)
          .substring(7),
      ];

      const accessories = [
        "kurt",
        "prescription01",
        "prescription02",
        "round",
        "sunglasses",
        "wayfarers",
      ];
      const mouths = [
        "serious",
        "smile",
        "twinkle",
        "eating",
        "lips",
        "smirk",
      ];
      const eyebrows = [
        "angry",
        "default",
        "flat",
        "raised",
        "up",
        "frown",
      ];
      const hairColors = [
        "0e0e0e",
        "3e1e18",
        "6d4c41",
        "a55728",
        "ac8e68",
        "d6b370",
        "ecdcbf",
      ];
      const skinColors = [
        "d08b5b",
        "ae5d29",
        "edb98a",
        "ffdbb4",
        "fd9841",
      ];

      for (
        let i = 0;
        i < 12;
        i++
      ) {
        const avatarConfig = {
          accessories:
            accessories[
              i %
                accessories.length
            ],
          mouth:
            mouths[
              i %
                mouths.length
            ],
          eyebrows:
            eyebrows[
              i %
                eyebrows.length
            ],
          hairColor:
            hairColors[
              i %
                hairColors.length
            ],
          skinColor:
            skinColors[
              i %
                skinColors.length
            ],
        };
        avatarOptionsList.push(
          generateAvatar(
            seeds[i],
            avatarConfig
          )
        );
      }

      // Simulate loading for better UX
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );
      setAvatarOptions(
        avatarOptionsList
      );
      setIsGeneratingAvatars(
        false
      );
    }, [
      formData,
      generateAvatar,
    ]);

  const handleInputChange = (
    e
  ) => {
    const { name, value } =
      e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Include the selected avatar in the form data
    const dataToSubmit = {
      ...formData,
      avatar: selectedAvatar,
    };

    try {
      const response =
        await fetch(
          "/api/user/update",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              dataToSubmit
            ),
          }
        );

      if (response.ok) {
        const updatedUser =
          await response.json();
        setUser(updatedUser);
        setSuccess(
          "Profile updated successfully!"
        );
        setIsEditing(false);

        // Clear success message after 3 seconds
        setTimeout(
          () =>
            setSuccess(""),
          3000
        );
      } else {
        const errorData =
          await response.json();
        setError(
          errorData.error ||
            "Failed to update profile"
        );
      }
    } catch (error) {
      setError(
        "An error occurred while updating profile"
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      username:
        user.username || "",
      email: user.email || "",
      firstName:
        user.firstName || "",
      lastName:
        user.lastName || "",
      phone: user.phone || "",
      address:
        user.address || "",
      avatar:
        user.avatar ||
        generateAvatar(
          user.email ||
            user.username ||
            "user"
        ),
    });
    setSelectedAvatar(
      user.avatar ||
        generateAvatar(
          user.email ||
            user.username ||
            "user"
        )
    );
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const selectAvatar = (
    avatarUrl
  ) => {
    setSelectedAvatar(
      avatarUrl
    );
    setShowAvatarModal(false);
  };

  const refreshAvatars =
    () => {
      generateAvatarOptions();
    };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">
            Loading your
            profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={
                  2
                }
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication
            Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be
            logged in to view
            this page
          </p>
          <button
            onClick={() =>
              router.push(
                "/login"
              )
            }
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your
            account
            information and
            preferences
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Success/Error Messages */}
          {error && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-black">
                  {error}
                </span>
              </div>
              <button
                onClick={() =>
                  setError("")
                }
                className="absolute top-3 right-3 text-red-700 hover:text-red-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {success && (
            <div className="m-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-black">
                  {success}
                </span>
              </div>
              <button
                onClick={() =>
                  setSuccess(
                    ""
                  )
                }
                className="absolute top-3 right-3 text-green-700 hover:text-green-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image Section */}
              <div className="lg:w-1/3 flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {/* Use img instead of Next.js Image for external SVGs */}
                  <img
                    src={
                      selectedAvatar
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <button
                      onClick={() =>
                        setShowAvatarModal(
                          true
                        )
                      }
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={
                            2
                          }
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {user.firstName &&
                    user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </h2>
                  <p className="text-gray-600">
                    {
                      user.email
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Member
                    since{" "}
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Profile Form Section */}
              <div className="lg:w-2/3">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Personal
                      Information
                    </h3>
                    {!isEditing ? (
                      <button
                        onClick={() =>
                          setIsEditing(
                            true
                          )
                        }
                        className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={
                              2
                            }
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit
                        Profile
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button
                          onClick={
                            handleCancel
                          }
                          className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={
                            handleSubmit
                          }
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Save
                          Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={
                      handleSubmit
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={
                            formData.username
                          }
                          onChange={
                            handleInputChange
                          }
                          disabled={
                            !isEditing
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 text-black transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={
                            formData.email
                          }
                          onChange={
                            handleInputChange
                          }
                          disabled={
                            !isEditing
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 text-black transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First
                          Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={
                            formData.firstName
                          }
                          onChange={
                            handleInputChange
                          }
                          disabled={
                            !isEditing
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 text-black transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last
                          Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={
                            formData.lastName
                          }
                          onChange={
                            handleInputChange
                          }
                          disabled={
                            !isEditing
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 text-black transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={
                            formData.phone
                          }
                          onChange={
                            handleInputChange
                          }
                          disabled={
                            !isEditing
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 text-black transition-colors"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={
                            formData.address
                          }
                          onChange={
                            handleInputChange
                          }
                          disabled={
                            !isEditing
                          }
                          rows={
                            3
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 text-black transition-colors"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Account Actions */}
                <div className="mt-8 bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Account
                    Actions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors group">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={
                                2
                              }
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          Delete
                          Account
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 ml-13">
                        Permanently
                        delete
                        your
                        account
                        and
                        all
                        data
                      </p>
                    </button>
                    <button className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors group">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={
                                2
                              }
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-900">
                          Change
                          Password
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 ml-13">
                        Update
                        your
                        password
                        for
                        better
                        security
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose Your
                  Avatar
                </h2>
                <button
                  onClick={() =>
                    setShowAvatarModal(
                      false
                    )
                  }
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={
                        2
                      }
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 mt-1">
                Select an
                avatar that
                represents you
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {isGeneratingAvatars ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {avatarOptions.map(
                      (
                        avatar,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          className={`cursor-pointer p-2 rounded-xl border-2 transition-all ${
                            selectedAvatar ===
                            avatar
                              ? "border-purple-600 bg-purple-50 shadow-md scale-105"
                              : "border-gray-200 hover:border-purple-400 hover:shadow-sm"
                          }`}
                          onClick={() =>
                            selectAvatar(
                              avatar
                            )
                          }
                        >
                          {/* Use img instead of Next.js Image for external SVGs */}
                          <img
                            src={
                              avatar
                            }
                            alt={`Avatar option ${
                              index +
                              1
                            }`}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={
                        refreshAvatars
                      }
                      className="flex items-center text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={
                            2
                          }
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Generate
                      New
                      Avatars
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() =>
                  setShowAvatarModal(
                    false
                  )
                }
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

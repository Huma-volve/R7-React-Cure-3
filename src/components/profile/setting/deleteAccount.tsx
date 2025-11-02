export const DeleteAccount = () => {
  return (
    <div className="space-y-4">
      <p className="text-sm ">
        Deleting your account is <span className="font-semibold text-red-600">permanent</span>  
         and will remove all your data from our system. This action cannot be undone.
      </p>

      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:cursor-pointer"
      >
        Delete Account
      </button>
    </div>
  )
}

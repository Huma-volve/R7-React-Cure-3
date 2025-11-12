import {useDeleteAccount} from "@/hooks/profile-setting/useDeleteAccount";


export const DeleteAccount = () => {
  const deleteAccount=useDeleteAccount();
  return (
    <div className="space-y-4">
      <p className="text-sm ">
        Deleting your account is <span className="font-semibold text-red-600">permanent</span>  
         and will remove all your data from our system. This action cannot be undone.
      </p>

      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:cursor-pointer"
        onClick={() => deleteAccount.mutate()}
        disabled={deleteAccount.isPending}
      >
        {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  )
}

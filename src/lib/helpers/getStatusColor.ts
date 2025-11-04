
  export const getStatusColor = (status: string) => {
    const colors = {
      todo: "bg-gray-500 text-white",
      in_progress: "bg-blue-500 text-white",
      review: "bg-yellow-500 text-black",
      done: "bg-green-500 text-white",
      disapprove: "bg-red-500 text-white",
      aprovadas: "bg-green-600 text-white",
      reprovadas: "bg-red-600 text-white",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };


  
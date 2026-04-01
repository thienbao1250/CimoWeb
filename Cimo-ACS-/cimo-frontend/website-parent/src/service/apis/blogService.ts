import axiosClient from "../../util/axiosClient";

const blogService = {
    getBlogs: async () => {
      try {
        const response = await axiosClient.get("/parents/home/blogs");
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  };

  export default blogService;
<script setup>
import { ref, onMounted } from "vue";

const candidates = ref([]);
const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);
const isFailed = ref(false);

const fetchCandidates = async (page = 1) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/get-all-users?page=${page}`
    );
    const data = await response.json();
    candidates.value = data;
  } catch (error) {
    isLoading.value = false;
    isFailed.value = true;
  }
};

const goToPage = (url) => {
  if (url) {
    const page = new URL(url).searchParams.get("page");
    console.log(page);
    fetchCandidates(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

onMounted(() => {
  isLoading.value = true;
  fetchCandidates();
  isLoading.value = false;
});

const deleteCandidate = async (id, page, event) => {
  event.preventDefault();
  const response = await fetch(`http://localhost:8000/api/delete-user/${id}`, {
    method: "DELETE",
  });
  if (response.status == 200) {
    isSuccess.value = true;
    setTimeout(() => {
      isSuccess.value = false;
    }, 2000);
    fetchCandidates(page);
  } else {
    isError.value = true;
    setTimeout(() => {
      isError.value = false;
    }, 2000);
  }
};
</script>

<template>
  <div class="">
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
      <div
        v-if="isSuccess"
        class="alert alert-success alert-dismissible fade show shadow-sm"
        role="alert"
      >
        Candidate deleted successfully!
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      <div
        v-else-if="isError"
        class="alert alert-danger alert-dismissible fade show shadow-sm"
        role="alert"
      >
        Error deleting candidate
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="isFailed" class="error-container">
      <div class="text-center text-danger mt-5 fs-1 fw-bold">
        Error fetching candidates
      </div>
    </div>

    <div v-else class="content-container">
      <div class="header-section">
        <h1 class="page-title">Candidates</h1>
      </div>

      <div class="table-wrapper">
        <div class="table-responsive">
          <table class="table">
            <thead class="table-header">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">NAME</th>
                <th scope="col">EMAIL</th>
                <th scope="col">PHONE</th>
                <th scope="col">RESUME URL</th>
                <th scope="col">EXPERIENCE LEVEL</th>
                <th scope="col">LOCATION</th>
                <th scope="col">JOINED AT</th>
                <th scope="col">ACTION</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="candidate in candidates.data"
                :key="candidate.id"
                class="table-row"
              >
                <th scope="row">{{ candidate.id }}</th>
                <td>{{ candidate.name }}</td>
                <td>{{ candidate.email }}</td>
                <td>{{ candidate.phone }}</td>
                <td>
                  <a
                    :href="candidate.resume"
                    class="text-decoration-none"
                    target="_blank"
                    >{{ candidate.resume }}</a
                  >
                </td>
                <td>{{ candidate.experience }}</td>
                <td>{{ candidate.location }}</td>
                <td>{{ candidate.created_at }}</td>
                <td>
                  <button
                    class="btn btn-danger delete-btn"
                    @click.prevent="
                      deleteCandidate(
                        candidate.id,
                        candidates.meta?.current_page,
                        $event
                      )
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flexdiv"></div>
      <div class="pagination-container">
        <div class="records-info">
          Showing {{ candidates.meta?.from }} to {{ candidates.meta?.to }} of
          {{ candidates.meta?.total }} records
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li
              v-for="link in candidates.meta?.links"
              :key="link.label"
              class="page-item"
              :class="{ active: link.active }"
            >
              <button
                class="page-link"
                @click="goToPage(link.url)"
                v-html="link.label"
              ></button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-container {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  min-height: calc(100vh - 1rem);
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
}

.header-section {
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.page-title {
  color: #1e293b;
  font-weight: 800;
  font-size: 2.5rem;
  margin: 0;
  position: relative;
  padding-left: 1.5rem;
  background: linear-gradient(120deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 80%;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  /* flex: 1; */
  min-height: 0;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
  /* backdrop-filter: blur(10px); */
}
.flexdiv {
  flex: 1;
}
.table-responsive {
  flex: 1;
  overflow: auto;
}

.table {
  margin-bottom: 0;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #ffffff;
}

.table-header {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
}

.table-header th {
  font-weight: 700;
  color: #475569;
  padding: 1.5rem 1rem;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  position: relative;
}

.table-header th::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.table-header th:hover::after {
  transform: scaleX(1);
}

.table-row {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
}

.table-row:hover {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.table-row td {
  padding: 1.5rem 1rem;
  vertical-align: middle;
  color: #334155;
  font-size: 0.95rem;
  position: relative;
}

.table-row th {
  padding: 1.5rem 1rem;
  font-weight: 600;
  color: #334155;
}

.delete-btn {
  padding: 0.6rem 1.2rem;
  font-size: 0.875rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.pagination-container {
  margin-top: 1rem;
  padding: 1.5rem;
  /* background: #ffffff;
  border-top: 1px solid #e2e8f0; */
}

.records-info {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.pagination {
  gap: 0.5rem;
  margin: 0;
}

.page-link {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.page-link:hover {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  border-color: #cbd5e1;
  color: #334155;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.page-item.disabled .page-link {
  color: #94a3b8;
  pointer-events: none;
  background-color: #f8fafc;
  border-color: #e2e8f0;
  box-shadow: none;
}

/* Custom scrollbar */
.table-responsive::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #8b5cf6, #3b82f6);
}

@media (max-width: 768px) {
  .table-header th,
  .table-row td,
  .table-row th {
    padding: 1.2rem 0.75rem;
    font-size: 0.9rem;
  }

  .delete-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-link {
    padding: 0.5rem 1rem;
  }
}
</style>

<template>
    <div class="filter-container p-3 mb-4 rounded shadow-sm">
        <h4 class="filter-heading mb-3">Filter Jobs</h4>
        
        <div class="mb-3">
            <label for="locationFilter" class="form-label">Location</label>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                <input 
                    v-model="localFilters.location" 
                    type="text" 
                    class="form-control" 
                    id="locationFilter"
                    placeholder="e.g., Cairo" 
                    @input="updateFilters"
                >
            </div>
        </div>
        
        <div class="mb-3">
            <label for="workTypeFilter" class="form-label">Work Type</label>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
                <select 
                    v-model="localFilters.work_type" 
                    class="form-select" 
                    id="workTypeFilter"
                    @change="updateFilters"
                >
                    <option value="">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">Onsite</option>
                    <option value="hybrid">Hybrid</option>
                </select>
            </div>
        </div>
        
        <div class="mb-3">
            <label for="sortSalary" class="form-label">Salary Range</label>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-cash"></i></span>
                <select 
                    v-model="localSort.salary" 
                    class="form-select" 
                    id="sortSalary" 
                    @change="updateSort"
                >
                    <option value="">No Sorting</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>
        </div>
        
        <div class="d-grid gap-2 mt-4">
            <button 
                class="btn btn-primary" 
                @click="resetFilters"
            >
                <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'JobFilter',
    props: {
        filters: {
            type: Object,
            default: () => ({ location: '', work_type: '' }),
        },
        sort: {
            type: Object,
            default: () => ({ salary: '' }),
        },
    },
    emits: ['update:filters', 'update:sort', 'filter-change', 'sort-change'],
    data() {
        return {
            localFilters: { ...this.filters },
            localSort: { ...this.sort }
        };
    },
    watch: {
        filters: {
            handler(newVal) {
                this.localFilters = { ...newVal };
            },
            deep: true
        },
        sort: {
            handler(newVal) {
                this.localSort = { ...newVal };
            },
            deep: true
        }
    },
    methods: {
        updateFilters() {
            this.$emit('update:filters', { ...this.localFilters });
            this.$emit('filter-change', { ...this.localFilters });
        },
        updateSort() {
            this.$emit('update:sort', { ...this.localSort });
            this.$emit('sort-change', { ...this.localSort });
        },
        resetFilters() {
            this.localFilters.location = '';
            this.localFilters.work_type = '';
            this.localSort.salary = '';
            this.updateFilters();
            this.updateSort();
        }
    }
};
</script>

<style scoped>
.filter-container {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
}

.filter-container:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.filter-heading {
    color: #1e293b;
    font-weight: 600;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 10px;
}

.form-label {
    font-weight: 500;
    color: #475569;
}

.input-group-text {
    background-color: #f8fafc;
    border-right: none;
}

.form-control, .form-select {
    border-left: none;
}

.form-control:focus, .form-select:focus {
    box-shadow: none;
    border-color: #ced4da;
    border-left: none;
}

.btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none;
    font-weight: 500;
    padding: 10px;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
    .filter-container {
        position: sticky;
        top: 70px;
        z-index: 100;
    }
}
</style>

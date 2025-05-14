<template>
    <div class="row mb-4">
        <div class="col-md-4">
            <label for="locationFilter" class="form-label">Filter by Location</label>
            <input v-model="filters.location" type="text" class="form-control" id="locationFilter"
                placeholder="e.g., Cairo" @input="$emit('update:filters', filters)">
        </div>
        <div class="col-md-4">
            <label for="workTypeFilter" class="form-label">Filter by Work Type</label>
            <select v-model="filters.work_type" class="form-select" id="workTypeFilter"
                @change="$emit('update:filters', filters)">
                <option value="">All</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
            </select>
        </div>
        <div class="col-md-4">
            <label for="sortSalary" class="form-label">Sort by Salary</label>
            <select v-model="sort.salary" class="form-select" id="sortSalary" @change="$emit('update:sort', sort)">
                <option value="">No Sorting</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
            </select>
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
    emits: ['update:filters', 'update:sort'],
};
</script>
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->text('responsibilities');
            $table->text('qualifications');
            $table->decimal('salary_min', 10, 2);
            $table->decimal('salary_max', 10, 2);
            $table->text('benefits')->nullable();
            $table->string('location');
            $table->enum('work_type', ['remote', 'onsite', 'hybrid']);
            $table->date('application_deadline');
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approval_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('jobs');
    }
}

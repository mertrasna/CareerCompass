function filterJobs(jobs, filter) {
    return jobs.filter(job => {
      return Object.keys(filter).every(key => job[key] === filter[key]);
    });
  }
  
  const jobs = [
    { title: 'Software Engineer', location: 'Remote', type: 'Full-Time' },
    { title: 'Data Scientist', location: 'New York', type: 'Part-Time' }
  ];
  
  // test 1
  const filter1 = { location: 'Remote' };
  const expected1 = [{ title: 'Software Engineer', location: 'Remote', type: 'Full-Time' }];
  const actual1 = filterJobs(jobs, filter1);
  console.log('Test Case 1:', JSON.stringify(actual1) === JSON.stringify(expected1) ? 'Pass' : 'Fail');
  
  // test 2
  const filter2 = { type: 'Part-Time' };
  const expected2 = [{ title: 'Data Scientist', location: 'New York', type: 'Part-Time' }];
  const actual2 = filterJobs(jobs, filter2);
  console.log('Test Case 2:', JSON.stringify(actual2) === JSON.stringify(expected2) ? 'Pass' : 'Fail');
  
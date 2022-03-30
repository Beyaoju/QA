## Performant Backend

### Challenge: 
Create a performant and scalable backend system in AWS capable of handling 100 requests per second (RPS) for **Product** and **Product Styles** routes.

Approach:
- Select Database (noSQL v SQL)
- Define and initialize model within DBMS
- Build Performant Queries
- Validate Performance Locally
- Deploy in AWS and Scale


### Selecting a Database
I selected PostgreSQL as the database of choice for the following reasons:
- [PostgreSQL is more performant vs. MongoDB](https://www.enterprisedb.com/news/new-benchmarks-show-postgres-dominating-mongodb-varied-workloads) and RPS is the goal!
- I wanted to use PostgreSQL aggregate functions to shape queries according to frontend requirements.
- This data won't have variations.
- The data is relational in nature (see below model).

### Define and Initialize Model

Having selected PostgreSQL as my DBMS, my immediate next step was to map out my database design. 

Using this diagram made translating each table's worth of data easier to translate to CREATE TABLE commands.

**Database Design**

![Screen Shot 2022-03-30 at 1 56 49 PM](https://user-images.githubusercontent.com/94568342/160929589-922e3759-7e70-4be0-a25a-276ba5556dae.png)

**Table query snapshot**

![Screen Shot 2022-03-30 at 1 58 32 PM](https://user-images.githubusercontent.com/94568342/160929770-4eaccc20-dfd2-48bd-ada1-a9ef766bffb1.png)

### Build Performant Queries

**Query Building**
I found building queries from scratch challenging. But by using PostgreSQL's [documentation](https://www.postgresql.org/docs/14/index.html), I was able to accurately shape the queried data to take the exact shape my frontend asked for.

![Screen Shot 2022-03-30 at 2 04 24 PM](https://user-images.githubusercontent.com/94568342/160930710-27e7444f-3ce7-488c-974a-c0a0d93507de.png)

**Query Plan Data**

By validating my query data shape according to my frontend's specifications, as well as query planning and execution times, I focused my attention on confirming performance locally before moving to the cloud.

**Query Plan Metrics :**

~ Planning Time: 5.757ms
~ Execution Time: 1.815ms

![Screen Shot 2022-03-29 at 9 21 44 AM](https://user-images.githubusercontent.com/43115008/160659122-87f6a031-fea5-4777-bf6c-f66befb4017b.png)

### Validating Performance Locally

**Local K6 Testing**

![Screen Shot 2022-03-29 at 9 24 47 AM](https://user-images.githubusercontent.com/43115008/160659671-603d8c9d-94c7-4a2a-9243-05368c16d097.png)

### Deploying and Scaling in AWS

By this point, I was energized. My aggregate functions shaped data according to spec, were performant, and showed promising K6 local testing results.

At this phase, I had a blast setting up EC2 T2.micros and measuring performance as I horizontally scaled.

**Test 1:**
Diagram:

![Screen Shot 2022-03-29 at 10 00 14 AM](https://user-images.githubusercontent.com/43115008/160666013-9a843674-8508-4ca3-a694-91842126d2ac.png)

Results:

![Screen Shot 2022-03-30 at 2 10 43 PM](https://user-images.githubusercontent.com/94568342/160931579-3fe17cad-6825-4778-b1ad-00a08203de62.png)

Notes: 

Cloud baseline established. While these results weren't as performant as my local K6 testing results, I was happy to have a baseline before moving onto additional architectures.

**Test 2:**
Diagram:

![Screen Shot 2022-03-29 at 10 01 52 AM](https://user-images.githubusercontent.com/43115008/160666261-760d8352-a140-43ca-b0e7-80a1a3291dbf.png)

Results:

![Screen Shot 2022-03-30 at 2 11 59 PM](https://user-images.githubusercontent.com/94568342/160931643-d1662f17-bd93-4ffc-ad82-1a25c34a2c80.png)

Notes:

T2.Micro EC2 instances come with 1 vGPU, which I hypothesized was being put under stress by hosting both the Express server as well as Postgres. I noted a large uptick in performance at 1,000 RPS, however, at the expense of a much higher latency.

**Test 3**
Diagram:

![Screen Shot 2022-03-29 at 10 06 40 AM](https://user-images.githubusercontent.com/43115008/160666984-211e25ad-c8b3-4e68-bee2-d367312d80ad.png)

Results:

![Screen Shot 2022-03-30 at 2 13 21 PM](https://user-images.githubusercontent.com/94568342/160931835-bfa05d45-83e6-49e0-8afc-db13b9d53faf.png)

Notes:

By introducing a NGINX Load Balancer, I was able to increase RPS by an additional 42.9% (Products) and 53.1% (Styles) while reducing latency by 61% (Styles) and 67% (Products). 

While I was excited adjust NGINX's config settings according to suggestions made in their documentation, I was suspect that my PostgreSQL DBMS EC2 bottlenecked performance - particularly because each request shaped a response in JSON via PostreSQL aggregate functions.

**Test 4**
Diagram:

![Screen Shot 2022-03-29 at 10 16 33 AM](https://user-images.githubusercontent.com/43115008/160668585-df2d8355-cc50-406b-a64e-4e1a2e238d80.png)

Results:

![Screen Shot 2022-03-30 at 2 14 10 PM](https://user-images.githubusercontent.com/94568342/160931950-b46be681-5e7f-4919-985a-d4ee75a5070b.png)

Notes:

While I saw decent performance gains in STYLES, I decided to continue horizontally scaling given the diminishing returns seen in PRODCUTS. 

**Test 5**
Diagram:

![Screen Shot 2022-03-29 at 10 18 42 AM](https://user-images.githubusercontent.com/43115008/160668944-f2d0d9fb-702f-4f9d-b54d-b8621e27b332.png)

Results:

![Screen Shot 2022-03-30 at 2 15 00 PM](https://user-images.githubusercontent.com/94568342/160932123-58df6580-9ce7-4375-9557-905a15648055.png)

Notes:

While building this setup was exciting, I was ultimately dissapointed with only a modest 10% increase in PRODUCTS RPS performance. At this point in time, I focused my attention toward [tuning my NGINX load balancer](https://www.nginx.com/blog/tuning-nginx/). 

**Test 6** - Caching Enabled
Results:

![Screen Shot 2022-03-30 at 2 16 12 PM](https://user-images.githubusercontent.com/94568342/160932324-58e26200-5b38-4cbf-be4f-7f79dcbe1aca.png)

Notes:

By enabling caching in my NGINX load balancer, I was able to drastically reduce cloud resources while **increasing performance to 3,700 RPS**. Caching reduced server and DBMS stress as well as latency, and drastically improved throughput.

**Final thoughts** 

If I had more time, I'd migrate my load balancer to a larger T2 instance and continue horizontally scaling.

![Screen Shot 2022-03-29 at 10 32 11 AM](https://user-images.githubusercontent.com/43115008/160671181-19971635-96bf-4657-b3d7-b3f30d73369b.png)

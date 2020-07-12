using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
//using System.Exception;
using MediatR;
using Persistence;
//using Domain;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request,
                    CancellationToken cancellationToken)
            {

                var activity_x = await _context.Activities.FindAsync(request.Id);

                if (activity_x == null)
                {
                    throw new Exception("Could not find activity");
                }
                if (activity_x == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });
                    
                activity_x.Title = request.Title ?? activity_x.Title;
                activity_x.Description = request.Description ?? activity_x.Description;
                activity_x.Category = request.Category ?? activity_x.Category;
                activity_x.Date = request.Date ?? activity_x.Date;
                activity_x.City = request.City ?? activity_x.City;
                activity_x.Venue = request.Venue ?? activity_x.Venue;


                try
                {
                    await _context.SaveChangesAsync();
                    return Unit.Value;

                }
                catch (Exception ex)
                {

                    throw new Exception("Problem saving changes  {" + ex.ToString() + "}");

                }
                /*
                return null;
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                

                throw new Exception("Problem saving changes  {" + success +"}");
                */
            }
        }

    }
}